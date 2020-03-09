export default function getSteps (json) {
  const steps = json.routes[0].legs[0].steps;
  const stepMap = new Map();
  steps.forEach((step) => {
    step.bannerInstructions.forEach((inst) => {
      const key = inst.primary.text;
      if (key.indexOf('fork') === -1 && key.indexOf('/') === -1 && key.indexOf(';') === -1 && step.maneuver.type !== 'off ramp') {
        inst.primary.components.forEach((component) => {
          const roadStr = component.text;
          if (roadStr.indexOf('CA ') === 0 || roadStr.indexOf('I-') === 0 || roadStr.indexOf('US ') === 0) {
            stepMap.set(roadStr, inst);
          }
        });
      } else {
      }
    });
  });
  return stepMap;
}
