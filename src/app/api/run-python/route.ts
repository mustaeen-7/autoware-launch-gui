// app/api/run-python/route.ts
import { NextResponse } from "next/server";
import { exec } from "child_process";



// This API endpoint accepts GET requests with query parameters
export async function GET(req: Request) {
  const url = new URL(req.url);
  const scriptPath = url.searchParams.get("script");
  const args = url.searchParams.get("args"); // Get the 'args' parameter if it exists
  console.log("GET",args);

  if (!scriptPath) {
    return new NextResponse("Script path is required", { status: 400 });
  }

  let command = `python3 ${scriptPath}`;
  console.log("command",command)

  // If args are provided, pass them to the script
  if (args) {
    // Split the args string by '&' to handle multiple arguments
    const formattedArgs = args
      .split("&")
      .map((arg) => {
        // Convert each argument from 'key=value' to '--key value'
        const [key, value] = arg.split("=");
        return `--${key} ${value}`;
      })
      .join(" ");

    command += ` ${formattedArgs}`;
  }

  console.log("command", command);

  return new Promise<NextResponse>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log("error", error);
        return reject(
          new NextResponse(`Error executing Python script: ${error.message}`, {
            status: 500,
          })
        );
      }
      if (stderr) {
        return reject(new NextResponse(`Error: ${stderr}`, { status: 500 }));
      }
      return resolve(new NextResponse(stdout, { status: 200 }));
    });
  });
}
