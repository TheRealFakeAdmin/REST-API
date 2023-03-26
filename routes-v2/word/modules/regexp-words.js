const regexpWords = (list, regexp) => {
    const [ resp, wrds ] = [ [], [] ];
    let n;
    switch (typeof regexp === "string" && regexp.length > 0) {
        case true:
            const rgxp = RegExp(regexp);
            list.forEach((v)=>{
                if (rgxp.test(v)) wrds.push(v);
            });
            break;
        case false:
            wrds.push(...list);
            break;
    };

    

    return wrds;
}

module.exports = regexpWords;