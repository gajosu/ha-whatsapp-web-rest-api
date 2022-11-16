import { parse } from 'ts-command-line-args'
interface IConfigArguments {
    port: number | undefined
    supervisorToken: string | undefined
    browserPath: string | undefined
}

const config: any = parse<IConfigArguments>({
    port: { type: Number, alias: 'p', defaultValue: 3000, optional: true },
    supervisorToken: { type: String, alias: 't', defaultValue: undefined, optional: true },
    browserPath: { type: String, alias: 'b', defaultValue: undefined, optional: true }
})

export default function getConfig<T> (name: string, defaultValue: any = null): T {
    return config[name] ?? defaultValue
}
