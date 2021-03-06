# Project Start Guide

Using Windows 10 Command Prompt

- `npx create-react-app react_flask_app`
`cd react_flask_app`

- `mkdir flask`
`cd flask`

- `py -m venv venv`
`venv\Scripts\activate`

- `pip install python-dotenv flask pandas redis pyarrow`

- Create a file called **.flaskenv** with lines:
    ```
    FLASK_APP=./src/server.py 
    FLASK_ENV=development
    ```

- Modify **~/react_flask_app/package.json**
    - Add to the root level:
        `"proxy": "http://localhost:5000/"`


- Modify **~/react_flask_app/.gitignore** to include:
    ```
    __pycache__/
    .vscode/
    ```

- Configure **~/react_flask_app/configs.json**
If you need to download redis you can get it [here](https://github.com/dmajkic/redis/downloads).


- Write your flask code in **~/flask/server.py**

- In separate command prompts run:
    `flask run`

    `yarn start`

Now you're set!
