const checkRequired = async (requiredArr, bodyData) => {
  const missing = [];
  requiredArr.forEach((element) => {
    const item = bodyData?.[element];
    if (typeof item !== "boolean" && !item) {
      missing.push(element);
    } else if (Array.isArray(item) && item.length === 0) {
        missing.push(element);
    }else if(!item){
      missing.push(item)
    }
  });
  return missing;
};

module.exports = { checkRequired };
