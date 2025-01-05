class ModularComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error("Container not found");
            return;
        }

        // Create parts
        this.top = document.createElement('div');
        this.middle = document.createElement('div');
        this.bottom = document.createElement('div');

        this.top.id = 'top-part';
        this.middle.id = 'middle-part';
        this.bottom.id = 'bottom-part';

        this.container.append(this.top, this.middle, this.bottom);
    }

    loadPart(part, jsFile) {
        import(jsFile)
            .then(module => module.init(this[part]))
            .catch(error => console.error(`Error loading ${part} part:`, error));
    }

    togglePart(part, visible) {
        this[part].style.display = visible ? 'block' : 'none';
    }
}
// Prayer_module.js
export function init(container) {
    if (!container) return;

    container.innerHTML = '<h1>Prayer Module Initialized</h1>';
    // Add additional functionality here
}
// Initialize module
const moduleInstance = new ModularComponent('module-container');
moduleInstance.loadPart('top', './topPart.js');
moduleInstance.loadPart('middle', './middlePart.js');
moduleInstance.loadPart('bottom', './bottomPart.js');
