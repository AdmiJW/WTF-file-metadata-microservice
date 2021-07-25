# WTF - What's The File

WTF is a file metadata microservice which returns the metadata of the uploaded file in json format.

Visit the application [__HERE__](https://wtfile.herokuapp.com/)

---

![Screenshot of the application](/public/img/Capture.JPG)

---

## Usage

Simply clone the repository, create an `.env` file in uppermost directory and set `PORT` environment variable if you want to (Defaults to 3000). Then, run `npm install` and `npm start`

## Environment Variables

| Environment Variable | Description |
|-|-|
| `NODE_ENV` | `production` or `development` |
| `PORT` | Port to run express application on. Default is `3000` |