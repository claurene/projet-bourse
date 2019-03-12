import { helper } from '@ember/component/helper';

let options = { year: 'numeric', month: 'numeric', day: 'numeric' };

export function formatDate(params/*, hash*/) {
  return new Date(params).toLocaleDateString('fr-FR',options);
}

export default helper(formatDate);
