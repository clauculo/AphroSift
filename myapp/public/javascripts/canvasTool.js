var photo = new Image();
var canvas = document.getElementById('canvas');
var photoSource = document.getElementById('photoSource').innerHTML;
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.font = '24px monospace';
ctx.fillText('Loading image...', 20, 40);

function toasterGradient(width, height) {
    var texture = document.createElement('canvas');
    var ctx = texture.getContext('2d');

    texture.width = width;
    texture.height = height;

    // Fill a Radial Gradient
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
    var gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.6);

    gradient.addColorStop(0, "#bebe42");
    gradient.addColorStop(1, "#0e3b2e");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return ctx;
}

function blend (background, foreground, width, height, transform) {
    var bottom = background.getImageData(0, 0, width, height);
    var top = foreground.getImageData(0, 0, width, height);

    for (var i = 0, size = top.data.length; i < size; i += 4) {
        // red
        top.data[i + 0] = transform(bottom.data[i + 0], top.data[i + 0]);
        // green
        top.data[i + 1] = transform(bottom.data[i + 1], top.data[i + 1]);
        // blue
        top.data[i + 2] = transform(bottom.data[i + 2], top.data[i + 2]);
        // the fourth slot is alpha. We don't need that (so skip by 4)
    }

    return top;
}

function render() {
    // Scale so that the image fills the container
    var width = window.innerWidth;
    var scale = width / photo.naturalWidth;
    var height = photo.naturalHeight * scale

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(photo, 0, 0, width, height);

    var gradient = toasterGradient(width, height);

    var screen = blend(ctx, gradient, width, height, function(bottomPixel, topPixel) {
        return 255 - (255 - topPixel) * (255 - bottomPixel) / 255;
    })

    ctx.putImageData(screen, 0, 0);
}

photo.onload = render;
photo.crossOrigin = "Anonymous";
// photo.src = "https://s3.amazonaws.com/share.viget.com/images/viget-works.jpg?bust=true";
photo.src = photoSource;