# SEGUID v2 Calculator

The SEGUID Calculator is a web-based GUI for the [SEGUID v2](https://www.seguid.org) method.  To include it in a web page,

1. import `boostrap.css`, `seguid.js`, and `seguid-calculator.js` in
   the header

2. add a `<div>` with ID `seguid-calculator` to the body, and

3. call `seguid_calculator()` at the end of the page.


Here's a minimal working example:

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <script src="https://rawcdn.githack.com/seguid/seguid-javascript/0.2.0/seguid.js"></script>
    <script src="https://rawcdn.githack.com/seguid/seguid-calculator/0.1.0/seguid-calculator.js"></script>

    <title>SEGUID v2 Calculator</title>
</head>

<body>
    <div id="seguid-calculator"></div>

    <script>
       seguid_calulator();
    </script>
  </body>
</html>
```
