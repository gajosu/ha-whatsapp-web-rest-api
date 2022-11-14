const config:any = {
    port: 3000,
}

export default function getConfig(name: string, defaultValue:any = null): any {
    return config[name] || defaultValue;
}