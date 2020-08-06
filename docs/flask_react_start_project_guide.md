# Project Start Guide

Using Windows 10 Command Prompt

- `npx create-react-app react_flask_app`
`cd react_flask_app`

- `mkdir flask_backend`
`cd flask_backend`

- `py -m venv venv`
`venv\Scripts\activate`

- `pip install python-dotenv flask pandas redis pyarrow`

- Create a file called **.flaskenv** with lines:
    ```
    FLASK_APP=server.py 
    FLASK_ENV=development
    ```

- Modify **~/react_flask_app/package.json**
    - Add to the root level:
        `"proxy": "http://localhost:5000/"`

    - Add to scripts:
        `"start-flask": "cd flask_backend &&  venv\\Scripts\\activate flask run --no-debugger"`

- Modify **~/react_flask_app/.gitignore** to include:
    ```
    __pycache__/
    .vscode/
    ```

- Configure **~/react_flask_app/configs.json**
If you need to download redis you can get it [here](https://github.com/dmajkic/redis/downloads).


- Write your flask code in **~/flask_backend/server.py**

- In separete command prompts run:
    `flask run`

    `yarn start`

Develop...
