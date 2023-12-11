/* eslint-disable @typescript-eslint/no-explicit-any */
async function fetchData() {
  try {
    const response = await fetch('/assets/words.json');
    const data = await response.json();
    self.postMessage(data);
  } catch (error: any) {
    console.log(error.message);
  }
}

fetchData();
