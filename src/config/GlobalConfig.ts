import { parse } from 'ts-command-line-args'
interface IConfigArguments {
    port?: number
    supervisorToken?: string
    browserPath?: string
}

const config: any = parse<IConfigArguments>({
    port: { type: Number, defaultValue: 3000, optional: true },
    supervisorToken: { type: String, optional: true },
    browserPath: { type: String, optional: true }
})

export default function getConfig<T> (name: string, defaultValue: any = null): T {
    return config[name] ?? defaultValue
}
