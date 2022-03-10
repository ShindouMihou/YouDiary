![image](https://user-images.githubusercontent.com/69381903/157640251-020c77b0-3e5f-4ece-b8ee-3e061efadd4c.png)
YouDiary is a simple, web-based markdown text editor that is intended for personal use. This was created for as a little experiment over Node's Filesystem API, bcrypt, sveltekit-adapter-node, marked.js and highlight.js.

# 📦 Installation
You can grab a quick instance of YouDiary by following the steps below:
1. Clone the project.
```bash
git clone https://github.com/ShindouMihou/YouDiary
```
2. Head to the backend folder after entering the cloned project.
```bash
cd YouDiary && cd backend
```
3. Rename the `.env.example` into `.env`.
```bash
mv .env.example .env
```
4. Configure the `.env` file to your liking, preferably, just change the bucket name and keep the bucket path.
```env
#----------
# YouDiary Configuration
#----------
BUCKET_NAME=DEFAULT
BUCKET_PATH=data
```
5. Move back to the root directory.
```bash
cd ..
```
6. Run docker-compose to build the containers and run them.
```bash
docker-compose up
```

Once docker-compose finishes building and running, you should be able to see something similar to this:
```bash
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

# 📚 Previews
<details>
  <summary>Previews</summary>
  
![Login](https://user-images.githubusercontent.com/69381903/157629377-dd87eb52-4c41-48ce-a386-416d5fa86536.png)
![Create](https://user-images.githubusercontent.com/69381903/157629514-e54ef478-56c5-4882-b420-07b0a394f7fa.png)
![Editor](https://user-images.githubusercontent.com/69381903/157629612-ace6ac70-9ae7-4cfe-9f69-c7e0fcbf67b4.png)
![Preview](https://user-images.githubusercontent.com/69381903/157629688-4bea006e-5956-468d-a508-a56a3ea4a64e.png)
![Dashboard](https://user-images.githubusercontent.com/69381903/157629741-4ce417ab-0fc0-4743-bcc6-390a2eb989fc.png)
![Delete by TailwindUi](https://user-images.githubusercontent.com/69381903/157629767-28d08f1f-585c-4653-a50e-016118aca4d6.png)
  
</details>

# 🍮 Credits
<details>
  <summary>Thanks to the developers behind these technologies</summary>
  
- Tailwind CSS (tailwindcss.com)
- Sveltekit (kit.svelte.dev)
- Markdown Test File (github.com/mxstbr/markdown-test-file)
- Marked.js (marked.js.org)
- Highlight.js (highlightjs.org)
- HeroPatterns (heropatterns.com)
- Heroicons (heroicons.com)
- Docker (docker.com)
- Node.js (nodejs.org)
- Express.js (expressjs.com)
- Bcrypt (npmjs.com/package/bcrypt)
- And all the other dependencies that is working behind the scenes.
  
</details>
