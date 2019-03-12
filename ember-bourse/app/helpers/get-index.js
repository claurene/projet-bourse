import { helper } from '@ember/component/helper';

export function getIndex([array, index]) {
  return array[index];
}

export default helper(getIndex);
