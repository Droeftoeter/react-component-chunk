function getDefaultExport(module) {
    return module.default || module;
}

export default module => Array.isArray(module)
    ? module.map(getDefaultExport)
    : getDefaultExport(module);
