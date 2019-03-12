import { helper } from '@ember/component/helper';

export function formatInteger(params/*, hash*/) {
  return parseInt(params);
}

export default helper(formatInteger);
