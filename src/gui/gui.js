import GUI from 'lil-gui';
import { params } from './params.js';
import { config } from '../physics/config.js';
import { resetRotation } from '../physics/integrators.js';

const gui = new GUI();
gui.title('لوحة التحكم');

// تكبير لوحة التحكم
gui.domElement.style.fontSize = '16px';
gui.domElement.style.width = '250px';
gui.domElement.style.minWidth = '250px';

// تخصيص مظهر لوحة التحكم
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

// إنشاء عناصر التحكم مع ربطها مع config (بدون عرض القيم في الأسماء)
const massController = gui.add(params, 'mass', 1, 1500).step(1).name('كتلة القمر الصناعي');
massController.onChange(() => {
    config.satelliteMass = params.mass;
    console.log('✅ تم تحديث كتلة القمر:', params.mass, 'kg');
});

const altitudeController = gui.add(params, 'altitudeKm', 0, 5000).step(10).name('الارتفاع (كم)');
altitudeController.onChange(() => {
    config.initialAltitude = params.altitudeKm * 1000;
    console.log('✅ تم تحديث الارتفاع:', params.altitudeKm, 'كم');
});

const velocityController = gui.add(params, 'velocityFactor', 0, 2).step(0.1).name('معامل السرعة');
velocityController.onChange(() => {
    // لا نحتاج لتحديث config هنا
    console.log('✅ تم تحديث معامل السرعة:', params.velocityFactor);
});

const fuelController = gui.add(params, 'fuelMass', 1, 1500).step(1).name('كتلة الوقود');
fuelController.onChange(() => {
    config.fuelMass = params.fuelMass;
    console.log('✅ تم تحديث كتلة الوقود:', params.fuelMass, 'kg');
});

const dtController = gui.add(params, 'dt', 0.1, 10).step(0.1).name('خطوة الوقت');
dtController.onChange(() => {
    config.dt = params.dt;
    console.log('✅ تم تحديث خطوة الوقت:', params.dt, 'ثانية');
});

const gravityController = gui.add(params, 'gravityEnabled').name('تفعيل الجاذبية');
gravityController.onChange(() => {
    config.enableGravity = params.gravityEnabled;
    console.log('✅ تم تحديث الجاذبية:', params.gravityEnabled ? 'مفعلة' : 'معطلة');
});

const dragController = gui.add(params, 'userDragEnabled').name('تفعيل مقاومة الهواء');
dragController.onChange(() => {
    config.userDragEnabled = params.userDragEnabled;
    console.log('✅ تم تحديث مقاومة الهواء:', params.userDragEnabled ? 'مفعلة' : 'معطلة');
    console.log('🔍 config.userDragEnabled =', config.userDragEnabled);
});

const airDensityController = gui.add(params, 'userAirDensity', 0.001, 2.0).step(0.01).name('كثافة الهواء');
airDensityController.onChange(() => {
    config.userAirDensity = params.userAirDensity;
    console.log('✅ تم تحديث كثافة الهواء:', params.userAirDensity, 'kg/m³');
    console.log('🔍 config.userAirDensity =', config.userAirDensity);
});



const torqueXController = gui.add(params, 'torqueX', -0.05, 0.05).step(0.001).name('عزم X');
const torqueYController = gui.add(params, 'torqueY', -0.05, 0.05).step(0.001).name('عزم Y');
const torqueZController = gui.add(params, 'torqueZ', -0.05, 0.05).step(0.001).name('عزم Z');

const maxWController = gui.add(params, 'maxAngularSpeed', 0.1, 10).step(0.1).name('السرعة الزاوية القصوى');
const warnWController = gui.add(params, 'warningAngularSpeed', 0.1, 10).step(0.1).name('عتبة الإنذار');
const rotationController = gui.add(params, 'enableRotation').name('تفعيل دوران القمر حول نفسه');
// ✅ زر تفعيل التخميد
const dampingController = gui.add(config, 'dampingEnabled').name('تفعيل التخميد');

// ✅ زر إعادة ضبط الدوران
const resetRotController = gui.add({ resetRotation }, 'resetRotation').name('إعادة ضبط الدوران');



const resetController = gui.add(params, 'resetOrbit').name('إعادة تعيين المدار');

// تخصيص مظهر أزرار التحكم
const controllers = [massController, altitudeController, velocityController, fuelController,
    dtController, gravityController, dragController, airDensityController,rotationController,
    resetController,torqueXController,torqueYController,torqueZController,maxWController,
    warnWController,dampingController,resetRotController];

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

// تخصيص مظهر أزرار الرقم
[massController, altitudeController, velocityController, fuelController, dtController, airDensityController].forEach(controller => {
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

// تخصيص زر إعادة التعيين
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

if (resetRotController.domElement) {
  const button = resetRotController.domElement.querySelector('button');
  if (button) {
    button.style.backgroundColor = '#08be4eff'; // لون مختلف لتمييزه
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





