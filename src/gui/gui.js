import GUI from 'lil-gui';
import {params} from './params.js';

const gui = new GUI();
gui.title('لوحة التحكم');

gui.add(params,'mass',1,1500).step(1).name('كتلة القمر الصناعي');
gui.add(params,'radius',500, 2000).step(10).name('نصف قطر الدار');
gui.add(params,'velocity', 0, 10).step(1).name('السرعة الابتدائية');
gui.add(params,'fuelMass',1,1500).step(1).name('كتلة الوقود');
gui.add(params,'exhaustVelocity',1,1500).step(1).name('سرعة العادم للمحرك');
gui.add(params, 'ForcesEnabled').name("تفعيل الجاذبية");