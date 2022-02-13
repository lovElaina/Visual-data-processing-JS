# Visual-data-processing-JS
Use canvas to display the data, and implement the import and dynamic modification of the json data source, and finally export the modified data

### This is a demo for visual data correction using canvas assistance

The x and y coordinates of each data item are necessary so that each data item can correspond to a point in the canvas. Therefore, we can intuitively perform data modification/corresponding operations through the points presented by each item of data.

Our demo shows the manual reprocessing (adjustment) process after image recognition.

First upload the image and the JSON source data to be adjusted, and then you can modify the data visually through a series of operations

- Drag any point with the mouse, and you can see the real-time x, y coordinates of the point in the right window. Of course, you can also directly input the specified value in the right window to modify.

- The mouse wheel can zoom in/out of the uploaded image.

- Double-click the left mouse button to add a data item, which is reflected in the canvas, which is a point, and then you can expand its various data in the data editing window on the right.

- No matter what you do, you don't have to worry about scale, the adjustment strategy has been implemented in the program.

For the specific usage process, you can view the example folder in the project root directory, where there are two files, the JSON data file to be adjusted and the image file. Upload these two files one after another and see the effect.

**HAVE FUN**
