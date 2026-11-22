# learning-experimentation

I use this public repository to build my understanding of software development by trying ideas in small projects. I write down what I tried, what worked, and what I would do differently so others can reproduce the experiments and use what we learn in their own projects.

The [learning log](LEARNING_LOG.md) is the starting point. Each entry records the question, the approach, and the outcome in plain language. Links to branches, pull requests, and demos give readers a way to inspect the implementation or try it themselves.

## First project

Build a small website people can use at a public URL. React provides the interface, Vite builds the frontend for GitHub Pages, and NestJS provides the API from a separate Node.js host. GitHub Pages serves static files, so the deployed React app will call the NestJS API over HTTPS. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

The project is planned. Follow the [first experiment](LEARNING_LOG.md#build-and-publish-a-react-site-with-a-nestjs-api) for milestones, findings, and the demo link once it is verified.
