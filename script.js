window.onload = function() {
    const navigatorTable = document.getElementById('navigator-table').querySelector('tbody');
    const pluginsTable = document.getElementById('plugins-table').querySelector('tbody');
    const devicesTable = document.getElementById('devices-table').querySelector('tbody');
    const screenTable = document.getElementById('screen-table').querySelector('tbody');
    const performanceTable = document.getElementById('performance-table').querySelector('tbody');
    const batteryTable = document.getElementById('battery-table').querySelector('tbody');
    const webglTable = document.getElementById('webgl-table').querySelector('tbody');
    const geolocationTable = document.getElementById('geolocation-table').querySelector('tbody');

    // Element references for window properties and mouse position
    const windowWidthElem = document.getElementById('window-width');
    const windowHeightElem = document.getElementById('window-height');
    const windowOuterWidthElem = document.getElementById('window-outer-width');
    const windowOuterHeightElem = document.getElementById('window-outer-height');
    const windowDevicePixelRatioElem = document.getElementById('window-device-pixel-ratio');
    const mouseXElem = document.getElementById('mouse-x');
    const mouseYElem = document.getElementById('mouse-y');
    const deviceOrientationAlphaElem = document.getElementById('orientation-alpha');
    const deviceOrientationBetaElem = document.getElementById('orientation-beta');
    const deviceOrientationGammaElem = document.getElementById('orientation-gamma');

    const navigatorInfo = {
        "navigator.userAgent": navigator.userAgent,
        "navigator.language": navigator.language,
        "navigator.onLine": navigator.onLine,
        "navigator.hardwareConcurrency": navigator.hardwareConcurrency,
        "navigator.deviceMemory": navigator.deviceMemory || "Unavailable",
        "navigator.maxTouchPoints": navigator.maxTouchPoints,
        "navigator.cookieEnabled": navigator.cookieEnabled,
        "navigator.plugins.length": navigator.plugins.length,
        "navigator.mimeTypes.length": navigator.mimeTypes.length,
        "navigator.doNotTrack": navigator.doNotTrack,
        
        // Deprecated properties
        "navigator.vendor (deprecated)": navigator.vendor, // Deprecated
        "navigator.platform (deprecated)": navigator.platform, // Deprecated
        "navigator.javaEnabled() (deprecated)": navigator.javaEnabled(), // Deprecated
        "navigator.vendorSub (deprecated)": navigator.vendorSub, // Deprecated
        "navigator.product (deprecated)": navigator.product, // Deprecated
        "navigator.appVersion (deprecated)": navigator.appVersion, // Deprecated
        "navigator.appName (deprecated)": navigator.appName, // Deprecated
        "navigator.appCodeName (deprecated)": navigator.appCodeName, // Deprecated
        "navigator.buildID (deprecated)": navigator.buildID, // Deprecated
        "navigator.oscpu (deprecated)": navigator.oscpu, // Deprecated
        "navigator.productSub (deprecated)": navigator.productSub, // Deprecated

        // Additional navigator properties
        "navigator.connection.effectiveType": navigator.connection.effectiveType,
        "navigator.connection.downlink": navigator.connection.downlink,
        "navigator.connection.rtt": navigator.connection.rtt,
        "navigator.connection.saveData": navigator.connection.saveData,
    };
    addRows(navigatorTable, navigatorInfo);

    // Get and display plugin information
    const pluginInfo = {};
    for (let i = 0; i < navigator.plugins.length; i++) {
        pluginInfo[`navigator.plugins[${i}].name`] = navigator.plugins[i].name;
    }
    addRows(pluginsTable, pluginInfo);

    // Get and display device information
    navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
            const row = devicesTable.insertRow();
            row.insertCell().textContent = device.kind;
            row.insertCell().textContent = device.label || 'N/A';
            row.insertCell().textContent = device.deviceId;
            row.insertCell().textContent = device.groupId;
        });
    }).catch(err => {
        addErrorRow(devicesTable, err);
    });

    // Screen Information
    const screenInfo = {
        "screen.width": screen.width,
        "screen.height": screen.height,
        "screen.colorDepth": screen.colorDepth,
        "screen.orientation.type": screen.orientation.type
    };
    addRows(screenTable, screenInfo);

    // Performance Information
    const performanceInfo = {
        "performance.now()": performance.now()
    };
    if (performance.memory) {
        performanceInfo["performance.memory.jsHeapSizeLimit"] = performance.memory.jsHeapSizeLimit;
        performanceInfo["performance.memory.totalJSHeapSize"] = performance.memory.totalJSHeapSize;
        performanceInfo["performance.memory.usedJSHeapSize"] = performance.memory.usedJSHeapSize;
    }
    addRows(performanceTable, performanceInfo);

    // Battery Information
    navigator.getBattery().then(function(battery) {
        const batteryInfo = {
            "battery.level": battery.level * 100 + "%",
            "battery.charging": battery.charging,
            "battery.chargingTime": battery.chargingTime,
            "battery.dischargingTime": battery.dischargingTime
        };
        addRows(batteryTable, batteryInfo);
    }).catch(err => {
        addErrorRow(batteryTable, err);
    });

    // WebGL Information
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const webglInfo = {
            "WEBGL Vendor": debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "Unavailable",
            "WEBGL Renderer": debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unavailable"
        };
        addRows(webglTable, webglInfo);
    } else {
        addErrorRow(webglTable, new Error("WebGL not supported"));
    }

    // Geolocation Information
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const geoInfo = {
                "geolocation.latitude": position.coords.latitude,
                "geolocation.longitude": position.coords.longitude,
                "geolocation.accuracy": position.coords.accuracy
            };
            addRows(geolocationTable, geoInfo);
        }, function(err) {
            addErrorRow(geolocationTable, err);
        });
    } else {
        addErrorRow(geolocationTable, new Error("Geolocation not supported"));
    }


    // Live Information //////////////////////////////////////////////////////////////

    // Function to update window size and pixel ratio
    function updateWindowSize() {
        windowWidthElem.textContent = window.innerWidth;
        windowHeightElem.textContent = window.innerHeight;
        windowOuterWidthElem.textContent = window.outerWidth;
        windowOuterHeightElem.textContent = window.outerHeight;
        windowDevicePixelRatioElem.textContent = window.devicePixelRatio;
    }

    // Function to update mouse position
    function updateMousePosition(event) {
        mouseXElem.textContent = event.clientX;
        mouseYElem.textContent = event.clientY;
    }

    // Function to update device orientation
    function updateDeviceOrientation(event) {
        deviceOrientationAlphaElem.textContent = event.alpha;
        deviceOrientationBetaElem.textContent = event.beta;
        deviceOrientationGammaElem.textContent = event.gamma;    
    }

    // Initial values
    updateWindowSize();

    // Add event listeners to update live information
    window.addEventListener('resize', updateWindowSize);
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('deviceorientation', updateDeviceOrientation);
};

// Table helper functions
function addRows(tableBody, data) {
    for (let key in data) {
        const row = tableBody.insertRow();
        row.insertCell().textContent = key;
        row.insertCell().textContent = data[key];
    }
}

function addErrorRow(tableBody, error) {
    const row = tableBody.insertRow();
    row.insertCell().colSpan = 2;
    row.insertCell().textContent = `Error: ${error.message}`;
}
