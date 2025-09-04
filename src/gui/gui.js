import GUI from 'lil-gui';
import { config, params } from '../physics/config.js';
import { state } from '../physics/state.js';
import { R_EARTH } from "../physics/constants.js";
import { resetRotation } from "../physics/integrators.js";
const gui = new GUI();
gui.title('لوحة التحكم');


gui.domElement.style.fontSize = '16px';
gui.domElement.style.width = '250px';
gui.domElement.style.minWidth = '250px';


const titleElement = gui.domElement.querySelector('.title');
if (titleElement) {
    titleElement.style.fontSize = '20px';
    titleElement.style.fontWeight = 'bold';
    titleElement.style.padding = '10px';
    titleElement.style.backgroundColor = '#2c3e50';
    titleElement.style.color = 'white';
    titleElement.style.borderRadius = '5px';
    titleElement.style.marginBottom = '15px';
}

const altitudeController = gui.add(params, 'altitudeKm', 0, 5000).step(10).name('الارتفاع (كم)');
altitudeController.onChange(() => {
    config.initialAltitude = params.altitudeKm * 1000;

});


const velocityOptions = { '0.1': 0.1, '1.0': 1.0, '1.2 ': 1.2, '2.0': 2.0 };
const velocityController = gui.add(params, 'velocityFactor', velocityOptions).name('🚀 معامل السرعة');
velocityController.onChange(() => {
    // تحديث السرعة الأولية بناءً على معامل السرعة
    updateInitialVelocity();

});

const dtController = gui.add(params, 'dt', 0.1, 10).step(0.1).name('خطوة الوقت');
dtController.onChange(() => {
    config.dt = params.dt;

});

const massController = gui.add(params, 'mass', 1, 5500).step(1).name('كتلة القمر الصناعي');
massController.onChange(() => {
    config.satelliteMass = params.mass;

});

const gravityController = gui.add(params, 'gravityEnabled').name('تفعيل الجاذبية');
gravityController.onChange(() => {
    config.enableGravity = params.gravityEnabled;

});

const dragController = gui.add(params, 'userDragEnabled').name('تفعيل مقاومة الهواء');
dragController.onChange(() => {
    config.userDragEnabled = params.userDragEnabled;

});




const torqueXController = gui.add(params, 'torqueX', -0.05, 0.05).step(0.001).name('عزم X');
const torqueYController = gui.add(params, 'torqueY', -0.05, 0.05).step(0.001).name('عزم Y');
const torqueZController = gui.add(params, 'torqueZ', -0.05, 0.05).step(0.001).name('عزم Z');

const maxWController = gui.add(params, 'maxAngularSpeed', 0.1, 10).step(0.1).name('السرعة الزاوية القصوى');
const warnWController = gui.add(params, 'warningAngularSpeed', 0.1, 10).step(0.1).name('عتبة الإنذار');
const rotationController = gui.add(params, 'enableRotation').name('تفعيل دوران القمر حول نفسه');
const dampingController = gui.add(config, 'dampingEnabled').name('تفعيل التخميد');
const resetRotController = gui.add({ resetRotation }, 'resetRotation').name('إعادة ضبط الدوران');



const resetController = gui.add(params, 'resetOrbit').name('إعادة تعيين المدار');
const resetDefaultsController = gui.add(params, 'resetToDefaults').name('إعادة تعيين القيم الافتراضية');


function updateInitialVelocity() {
    const r = state.position.length();
    if (r > R_EARTH) {
        const circularVelocity = Math.sqrt(6.67430e-11 * 5.972e24 / r);
        const newVelocity = circularVelocity * params.velocityFactor;
        state.velocity.set(0, 0, newVelocity);
    }
}

// تخصيص مظهر أزرار التحكم
const controllers = [massController, altitudeController, velocityController,
    dtController, gravityController, dragController, rotationController,
    resetController, resetDefaultsController, torqueXController, torqueYController, torqueZController, maxWController,
    warnWController, dampingController, resetRotController];

controllers.forEach(controller => {
    if (controller.domElement) {
        controller.domElement.style.marginBottom = '8px';
        controller.domElement.style.padding = '5px';
    }
});

// تخصيص مظهر أزرار التبديل
[gravityController, dragController].forEach(controller => {
    if (controller.domElement) {
        const checkbox = controller.domElement.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.style.width = '20px';
            checkbox.style.height = '20px';
        }
    }
});


[massController, altitudeController, dtController].forEach(controller => {
    if (controller.domElement) {
        const slider = controller.domElement.querySelector('input[type="range"]');
        if (slider) {
            slider.style.width = '200px';
            slider.style.height = '8px';
        }
        const numberInput = controller.domElement.querySelector('input[type="number"]');
        if (numberInput) {
            numberInput.style.width = '80px';
            numberInput.style.fontSize = '14px';
        }
    }
});

if (velocityController.domElement) {
    const select = velocityController.domElement.querySelector('select');
    if (select) {
        select.style.width = '200px';
        select.style.fontSize = '14px';
        select.style.padding = '5px';
    }
}


if (resetController.domElement) {
    const button = resetController.domElement.querySelector('button');
    if (button) {
        button.style.backgroundColor = '#1c81deff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '15px';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.width = '100%';
        button.style.textAlign = 'center';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
    }
}

if (resetDefaultsController.domElement) {
    const button = resetDefaultsController.domElement.querySelector('button');
    if (button) {
        button.style.backgroundColor = '#ff8400ff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '15px';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.width = '100%';
        button.style.textAlign = 'center';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
    }
}

if (resetRotController.domElement) {
    const button = resetRotController.domElement.querySelector('button');
    if (button) {
        button.style.backgroundColor = '#08be4eff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '15px';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.width = '100%';
        button.style.textAlign = 'center';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
    }
}





