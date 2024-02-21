let ping = function (serverURL) {
    return new Promise(async (resolve, reject) => {
        const urlFormatTestString = new RegExp('^(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$');
        if (!urlFormatTestString.test(serverURL)) {
        reject(`Invalid URL: ${serverURL}`);
        return;
      }
  
      let totalRoundTripTime = 0;
  
      for (let i = 0; i < 10; i++) {
        const myRequest = new Request(serverURL, {
          method: "GET",
          mode: "no-cors",
          cache: "no-cache",
          referrerPolicy: "no-referrer"
        });
  
        let sendTime = new Date();
  
        try {
          let response = await fetch(myRequest);
          let receiveTime = new Date();
          let rtt = receiveTime.getTime() - sendTime.getTime();
          console.log(`Round-trip time for request ${i + 1}: ${rtt} ms`);
          totalRoundTripTime += rtt;
        } catch (error) {
          console.error('Error:', error);
        }
      }
  
      const averageRoundTripTime = totalRoundTripTime / 10;
      resolve(averageRoundTripTime);
    });
  };
  
  let serverURL = "https://www.rutgers.edu/";
  ping(serverURL)
    .then((averageRoundTripTime) => {
      console.log("Average Round-trip time:", averageRoundTripTime, "ms");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  