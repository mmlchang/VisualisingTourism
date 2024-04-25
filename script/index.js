function init() {
    /* ----------- Navigation Bar ---------- */
    $('.open-overlay').click(function() {
        $('.open-overlay').css('pointer-events', 'none');
        var overlay_navigation = $('.overlay-navigation'),
        top_bar = $('.bar-top'),
        middle_bar = $('.bar-middle'),
        bottom_bar = $('.bar-bottom');

        overlay_navigation.toggleClass('overlay-active');
        if (overlay_navigation.hasClass('overlay-active')) {
            top_bar.removeClass('animate-out-top-bar').addClass('animate-top-bar');
            middle_bar.removeClass('animate-out-middle-bar').addClass('animate-middle-bar');
            bottom_bar.removeClass('animate-out-bottom-bar').addClass('animate-bottom-bar');
            overlay_navigation.removeClass('overlay-slide-up').addClass('overlay-slide-down')
            overlay_navigation.velocity('transition.slideLeftIn', {
            duration: 300,
            delay: 0,
            begin: function() {
                $('nav ul li').velocity('transition.perspectiveLeftIn', {
                stagger: 150,
                delay: 0,
                complete: function() {
                    $('nav ul li a').velocity({
                    opacity: [1, 0],
                    }, {
                    delay: 10,
                    duration: 140
                    });
                    $('.open-overlay').css('pointer-events', 'auto');
                }
                })
            }
            })

        } else {
            $('.open-overlay').css('pointer-events', 'none');
            top_bar.removeClass('animate-top-bar').addClass('animate-out-top-bar');
            middle_bar.removeClass('animate-middle-bar').addClass('animate-out-middle-bar');
            bottom_bar.removeClass('animate-bottom-bar').addClass('animate-out-bottom-bar');
            overlay_navigation.removeClass('overlay-slide-down').addClass('overlay-slide-up')
            $('nav ul li').velocity('transition.perspectiveRightOut', {
            stagger: 150,
            delay: 0,
            complete: function() {
                overlay_navigation.velocity('transition.fadeOut', {
                delay: 0,
                duration: 300,
                complete: function() {
                    $('nav ul li a').velocity({
                    opacity: [0, 1],
                    }, {
                    delay: 0,
                    duration: 50
                    });
                    $('.open-overlay').css('pointer-events', 'auto');
                }
                });
            }
            })
        }
    })

    /* ----------- Display parallax scrolling background ---------- */
    let text = document.getElementById('text');
    let bird1 = document.getElementById('bird1');
    let bird2 = document.getElementById('bird2');
    let rocks = document.getElementById('rocks');

    window.addEventListener('scroll', function () {

        let value = window.scrollY;
        text.style.top = 30 + value * -0.1 + '%';
        bird1.style.top = 10 + value * -0.2 + 'px';
        bird1.style.left = value * 1.3 + 'px';
        bird2.style.top = 50 + value * -0.5 + 'px';
        bird2.style.left = value * -5 + 'px';
        rocks.style.top = value * -0.12 + 'px';
    })

    /* ----------- Dotted map ---------- */
    var renderer, scene, camera, ww, wh, particles;
    ww = window.innerWidth,
        wh = window.innerHeight;
    var centerVector = new THREE.Vector3(0, 0, 0);
    var previousTime = 0;
    var mapAnimated = false; // Flag to check if the map animation has started

    var getImageData = function (image) {

        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        return ctx.getImageData(0, 0, image.width, image.height);
    }

    var drawTheMap = function () {
        if (!mapAnimated) { // Ensure animation only starts once
            var geometry = new THREE.Geometry();
            var material = new THREE.PointsMaterial({
                size: 2.5,
                color: 0xFFFFFF,
                sizeAttenuation: false
            });
            for (var y = 0, y2 = imagedata.height; y < y2; y += 2) {
                for (var x = 0, x2 = imagedata.width; x < x2; x += 2) {
                    if (imagedata.data[(x * 4 + y * 4 * imagedata.width) + 3] > 128) {

                        var vertex = new THREE.Vector3();
                        vertex.x = Math.random() * 1000 - 500;
                        vertex.y = Math.random() * 1000 - 500;
                        vertex.z = -Math.random() * 500;

                        vertex.destination = {
                            x: x - imagedata.width / 2,
                            y: -y + imagedata.height / 2,
                            z: 0
                        };

                        vertex.speed = Math.random() / 50 + 0.1;

                        geometry.vertices.push(vertex);
                    }
                }
            }
            particles = new THREE.Points(geometry, material);

            scene.add(particles);

            requestAnimationFrame(render);
            mapAnimated = true; // Set the flag to true after the animation starts
        }
    };

    var onResize = function () {
        ww = window.innerWidth;
        wh = window.innerHeight;
        renderer.setSize(ww, wh);
        camera.aspect = ww / wh;
        camera.updateProjectionMatrix();
    };

    var render = function (a) {

        requestAnimationFrame(render);

        for (var i = 0, j = particles.geometry.vertices.length; i < j; i++) {
            var particle = particles.geometry.vertices[i];
            particle.x += (particle.destination.x - particle.x) * particle.speed;
            particle.y += (particle.destination.y - particle.y) * particle.speed;
            particle.z += (particle.destination.z - particle.z) * particle.speed;
        }

        if (a - previousTime > 50) {
            var index = Math.floor(Math.random() * particles.geometry.vertices.length);
            var particle1 = particles.geometry.vertices[index];
            var particle2 = particles.geometry.vertices[particles.geometry.vertices.length - index];
            TweenMax.to(particle, Math.random() * 0.5 + 0.2, { x: particle2.x, y: particle2.y, ease: Power2.easeInOut });
            TweenMax.to(particle2, Math.random() * 0.5 + 0.2, { x: particle1.x, y: particle1.y, ease: Power2.easeInOut });
            previousTime = a;
        }

        particles.geometry.verticesNeedUpdate = true;
        camera.position.x = Math.sin(a / 5000) * 100;
        camera.lookAt(centerVector);

        renderer.render(scene, camera);
    };

    /* ----------- Initialize Three.js map ---------- */
    var texture, imagedata;

    THREE.ImageUtils.crossOrigin = '';
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("map"),
        antialias: true
    });
    renderer.setSize(ww, wh);
    renderer.setClearColor(0x094b65);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, ww / wh, 0.1, 10000);
    camera.position.set(-100, 0, 220);
    camera.lookAt(centerVector);
    scene.add(camera);

    texture = THREE.ImageUtils.loadTexture("images/transparentMap.png", undefined, function () {
        imagedata = getImageData(texture.image);
    });

    window.addEventListener('resize', onResize, false);

    // Add scroll event listener to trigger animation on scroll
    window.addEventListener('scroll', function () {
        drawTheMap();
    });

    /* ----------- Back To Top Button ---------- */
    const backToTopButton = document.querySelector("#back-to-top-btn");
    
    window.addEventListener("scroll", scrollFunction);

    function scrollFunction() {
    if (window.pageYOffset > 300) { // Show backToTopButton
        if(!backToTopButton.classList.contains("btnEntrance")) {
        backToTopButton.classList.remove("btnExit");
        backToTopButton.classList.add("btnEntrance");
        backToTopButton.style.display = "block";
        }
    }
    else { // Hide backToTopButton
        if(backToTopButton.classList.contains("btnEntrance")) {
        backToTopButton.classList.remove("btnEntrance");
        backToTopButton.classList.add("btnExit");
        setTimeout(function() {
            backToTopButton.style.display = "none";
        }, 250);
        }
    }
    }

    backToTopButton.addEventListener("click", smoothScrollBackToTop);

    function smoothScrollBackToTop() {
    const targetPosition = 0;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 750;
    let start = null;
    
    window.requestAnimationFrame(step);

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
        if (progress < duration) window.requestAnimationFrame(step);
    }
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    };
}

window.onload = init;
