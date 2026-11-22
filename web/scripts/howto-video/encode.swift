// Turns numbered PNG frames plus an audio file into an MP4 (H.264 video,
// AAC audio), using only Apple's AVFoundation. No ffmpeg needed.
//
// Usage: swift encode.swift <frames-dir> <fps> <audio.m4a> <out.mp4> <video-bits-per-second>
import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

let args = CommandLine.arguments
guard args.count == 6, let fps = Int32(args[2]), let bitRate = Int(args[5]) else {
  fputs("usage: swift encode.swift <frames-dir> <fps> <audio.m4a> <out.mp4> <bits-per-second>\n", stderr)
  exit(2)
}
let framesDir = URL(fileURLWithPath: args[1])
let audioURL = URL(fileURLWithPath: args[3])
let outURL = URL(fileURLWithPath: args[4])
let videoOnlyURL = framesDir.appendingPathComponent("video-only.mp4")

func loadImage(_ url: URL) -> CGImage {
  guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
        let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    fatalError("Can't read \(url.path)")
  }
  return image
}

let frameURLs = try FileManager.default
  .contentsOfDirectory(at: framesDir, includingPropertiesForKeys: nil)
  .filter { $0.pathExtension == "png" }
  .sorted { $0.lastPathComponent < $1.lastPathComponent }
guard let first = frameURLs.first else { fatalError("No PNG frames in \(framesDir.path)") }
let width = loadImage(first).width
let height = loadImage(first).height

// Step 1: write the frames as an H.264 video with no sound.
try? FileManager.default.removeItem(at: videoOnlyURL)
let writer = try AVAssetWriter(outputURL: videoOnlyURL, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: width,
  AVVideoHeightKey: height,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: bitRate,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    AVVideoMaxKeyFrameIntervalKey: Int(fps) * 2,
  ],
])
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
  kCVPixelBufferWidthKey as String: width,
  kCVPixelBufferHeightKey as String: height,
])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

for (index, url) in frameURLs.enumerated() {
  while !input.isReadyForMoreMediaData { usleep(2_000) }
  var buffer: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &buffer)
  guard let pixels = buffer else { fatalError("No pixel buffer") }
  CVPixelBufferLockBaseAddress(pixels, [])
  let context = CGContext(
    data: CVPixelBufferGetBaseAddress(pixels), width: width, height: height, bitsPerComponent: 8,
    bytesPerRow: CVPixelBufferGetBytesPerRow(pixels), space: CGColorSpaceCreateDeviceRGB(),
    bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)!
  context.draw(loadImage(url), in: CGRect(x: 0, y: 0, width: width, height: height))
  CVPixelBufferUnlockBaseAddress(pixels, [])
  adaptor.append(pixels, withPresentationTime: CMTime(value: CMTimeValue(index), timescale: fps))
}
input.markAsFinished()
await writer.finishWriting()
guard writer.status == .completed else { fatalError("Video failed: \(String(describing: writer.error))") }

// Step 2: put the video and the narration together in one MP4.
let composition = AVMutableComposition()
let video = AVURLAsset(url: videoOnlyURL)
let audio = AVURLAsset(url: audioURL)
let videoDuration = try await video.load(.duration)
let videoTrack = try await video.loadTracks(withMediaType: .video)[0]
let audioTrack = try await audio.loadTracks(withMediaType: .audio)[0]
let audioDuration = try await audio.load(.duration)
let range = CMTimeRange(start: .zero, duration: videoDuration)
try composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
  .insertTimeRange(range, of: videoTrack, at: .zero)
try composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
  .insertTimeRange(CMTimeRange(start: .zero, duration: CMTimeMinimum(audioDuration, videoDuration)), of: audioTrack, at: .zero)

try? FileManager.default.removeItem(at: outURL)
guard let export = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetPassthrough) else {
  fatalError("Can't create the export session")
}
// Puts the index at the start of the file, so browsers can start playing
// before the whole file has downloaded.
export.shouldOptimizeForNetworkUse = true
try await export.export(to: outURL, as: .mp4)
print("Wrote \(outURL.path)")
