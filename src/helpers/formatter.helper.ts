
export const  usdFormatterCompat =  (value: number) => {
     const formatter = Intl.NumberFormat("en", {style: "currency", currency: "USD", notation: "compact" });
    return formatter.format(value);
}

export const  usdFormatter =  (value: number) => {

    const formatter = Intl.NumberFormat("en", { style: "currency", currency: "USD" });
    return formatter.format(value);

}

export  const fixedFormatter = (value: number) => {
    const formatter = Intl.NumberFormat("en", { style: "decimal", maximumFractionDigits: 8 });
    return formatter.format(value);
}


