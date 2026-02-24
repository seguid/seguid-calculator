# SEGUID Calculator

The SEGUID Calculator is a web-based GUI for the [SEGUID v2](https://www.seguid.org) method. To include it in a web page,

1. import `bootstrap.css` and `seguid-calculator.js` in the header

2. add a `<div>` with ID `seguid-calculator` to the body

The script auto-initializes on `DOMContentLoaded` and loads `seguid.js` automatically if it is not already included.


## Local testing

Open `index.html` directly in your browser:

```sh
open index.html
```


## Minimal working example

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://rawcdn.githack.com/seguid/seguid-calculator/main/seguid-calculator.js"></script>
    <title>SEGUID Calculator</title>
</head>

<body>
    <div id="seguid-calculator"></div>
</body>
</html>
```
