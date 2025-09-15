// Shared utility functions for randomization and cloning

function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function getRandomElement(arr) { if (!arr || arr.length === 0) return null; return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomImage(imageArray) {
    if (!imageArray || imageArray.length === 0) return '';
    const idx = Math.floor(Math.random() * imageArray.length);
    return imageArray[idx];
}

// Deep clone function (ensure this is present in your script.js)
// This version aims to handle potential circular references and avoids cloning functions directly,
// which is suitable if methods are on the prototype.
function deepClone(obj, seen = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // Handle Date objects
    if (obj instanceof Date) {
        return new Date(obj);
    }

    // Handle RegExp objects
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    // Circular reference check
    if (seen.has(obj)) {
        // console.warn("DeepClone encountered a circular reference. Returning the seen instance.", obj);
        return seen.get(obj); // Return the already cloned object if a cycle is detected
    }

    let clonedObj;
    if (Array.isArray(obj)) {
        clonedObj = [];
        seen.set(obj, clonedObj); // Set the reference before recursing for arrays
        for (let i = 0; i < obj.length; i++) {
            clonedObj[i] = deepClone(obj[i], seen);
        }
    } else {
        // Handling for generic objects, including class instances (data properties only)
        clonedObj = Object.create(Object.getPrototypeOf(obj)); // Preserve prototype
        seen.set(obj, clonedObj); // Set the reference before recursing for objects
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (typeof obj[key] !== 'function') { // Clone only data properties
                    clonedObj[key] = deepClone(obj[key], seen);
                } else {
                    // Functions are not deep cloned to avoid issues; methods should come from prototype
                }
            }
        }
    }
    return clonedObj;
}