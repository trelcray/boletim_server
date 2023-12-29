import { app } from "./app";

const port = process.env.PORT ?? 8081;
app.listen({ port: port as number }).then(() => {
  console.log("listening on port: " + port);
});
