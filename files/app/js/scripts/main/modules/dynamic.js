// Dynamic import
// Функция, которая проверяет есть ли на странице переданный селектор 
// и если такой есть импортирует модуль
const checkAndImport = (selectorsAndModules = []) => {
  const dynamicImport = (moduleName) => import(/* webpackChunkName: "[request]"  */ `./dynamic/${moduleName}`);
  const checkingElementExistence = (selector) => $(selector).length;

  selectorsAndModules.forEach((item) => {
    if (checkingElementExistence(item.selector)) {
      console.log(`${item.moduleName} import`);
      return dynamicImport(item.moduleName);
    }
  });
}

const dynamicModules = [
  {
    // selector: `#${config.forms.id.reportAnError}`,
    // moduleName: 'work-time.js',
  },
];

checkAndImport(dynamicModules);