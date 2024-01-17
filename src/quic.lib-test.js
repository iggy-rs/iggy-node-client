
import { WebTransport } from '@fails-components/webtransport';

console.log(WebTransport);

let isOpen = false;

async function readData(reader) {

  reader.closed
    .catch((err) => console.error("Failed to close", err.toString()))
    .finally(() => isOpen = false);

  while (isOpen) {
    try {
      const { done, value } = await reader.read();
      if (done) { break; }

      console.log("Received:", value);
    } catch (err) {
      console.log("Failed to read...", err.toString());
      break;
    }
  }
};

const main = async () => {

  try { 
    const transport = new WebTransport("https://demo.web-transport.io:4433");
    // const transport = new WebTransport("https://127.0.0.1:8080");
    // console.dir(transport);

    // transport.ready.then((...arg) => console.log('READY !', arg));

    const readableStream = transport.datagrams.readable.getReader();
    console.dir(readableStream);

    // isOpen = true;
    // readData(readableStream);
  } catch(err) {
    console.error('connexion failed', err);
    isOpen = false;
  }


};

main();
