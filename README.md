# YouDiary
YouDiary is a simple, web-based markdown text editor that is intended for personal use. This was created for as a little experimentation over Node's filesystem, Bcrypt and Node Svelte plus Marked.

# Installation
You can grab a quick instance of YouDiary by following the steps below:
1. Clone the project: `git clone https://github.com/ShindouMihou/YouDiary`
2. Head to the backend folder after entering the cloned project: `cd YouDiary && cd backend`
3. Rename the `.env.example` into `.env`: `mv .env.example .env`
4. Configure the `.env` file to your liking, preferably, just change the bucket name and keep the bucket path.
5. Move back to the root directory: `cd ..`
6. Run docker-compose to build the containers and run them: `docker-compose up`

Once docker-compose finishes building and running, you should be able to see something similar to this:
```shell
youdiary_client     | Listening on 0.0.0.0:3000
youdiary_backend    | 
youdiary_backend    | > youdiary-backend@1.0.0 prod
youdiary_backend    | > node ./src/index.js
youdiary_backend    | 
youdiary_backend    | YouDiary, Bucketeer
youdiary_backend    | A simple web-based mark-down text editor.
youdiary_backend    | 
youdiary_backend    | Please do not share your bucket informatiaton unless you want others to access the data from the front-end.
youdiary_backend    | Port: 2312, Bucket: JDJiJDEwJEtZeXVlSnpLLkw2ZGtSeEhYVTg5M2UxZEFnL1BrNmdPd2hiUzNYdnBmSm05cm9QYUR3dmxp
```

You can now head to `localhost:3000` where you will be greeted with two text fields:
- **Host**: This should be `localhost:2312` by default, unless you reconfigured the port or similar.
- **Bucket**: The bucket is similar to a secret token that the hoster can see on the console, you should have already noticed it beside the port on the console report, copy the entire bucket text then paste it. In the example case, it would be `JDJiJDEwJEtZeXVlSnpLLkw2ZGtSeEhYVTg5M2UxZEFnL1BrNmdPd2hiUzNYdnBmSm05cm9QYUR3dmxp`.

You can now login and start creating a new page by pressing the `+` symbol where you can type the name of the page and start typing your markdown. To view the markdown preview, you can press the Beaker icon and to save the page, you can press the Save icon*.

* YouDiary does not auto-save, but there are plans to implement such feature.