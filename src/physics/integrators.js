import { attitude } from "./attitude.js";

function normalize(q){
  const n = Math.hypot(q[0], q[1], q[2], q[3]);
  return q.map(v => v / n);
}

export function updateQuaternion(dt){
  let [q0,q1,q2,q3] = attitude.q; // q0 = w
  const [wx,wy,wz] = attitude.omega; // rad/s

  attitude.omega = [0,0.5,0]
  // q' = 1/2 * q ⊗ [0, ω]
  const dq0 = 0.5 * (-q1*wx - q2*wy - q3*wz);
  const dq1 = 0.5 * ( q0*wx + q2*wz - q3*wy);
  const dq2 = 0.5 * ( q0*wy - q1*wz + q3*wx);
  const dq3 = 0.5 * ( q0*wz + q1*wy - q2*wx);

  q0 += dq0 * dt;
  q1 += dq1 * dt;
  q2 += dq2 * dt;
  q3 += dq3 * dt;

  attitude.q = normalize([q0,q1,q2,q3]);
}
