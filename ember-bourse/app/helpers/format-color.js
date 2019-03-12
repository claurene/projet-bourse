import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export function formatColor(params/*, hash*/) {
  let value = parseFloat(params).toFixed(2);
  if (value>=0) {
    return htmlSafe("<span class='has-text-success'>+"+value+" €</span>");
  } else {
    return htmlSafe("<span class='has-text-danger'>"+value+" €</span>");
  }
}

export default helper(formatColor);
