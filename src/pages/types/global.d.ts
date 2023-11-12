
declare interface Window {
  config: {
    blogs: {
      [key: string]: string[]
    },
    build_time: string
    ENV: "dev" | "prod" | "test"
  }
}