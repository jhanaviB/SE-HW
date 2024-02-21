var averageRoundTripTime;
var dataMatch = 0;
export let ping = function (serverURL) {
    return new Promise(async (resolve, reject) => {
        const urlFormat = new RegExp('^(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$');
        if (!urlFormat.test(serverURL)) {
            reject(`Invalid URL: ${serverURL}`);
            return;
        }

        let totalRoundTripTime = 0;

        const pingLoop = async () => {
            for (let i = 0; i < 10; i++) {
                const myRequest = new Request(serverURL, {
                    method: "POST",
                    mode: "no-cors",
                    cache: "no-cache",
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify("Hello"),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                let sendTime = new Date();

                try {
                    let response = await fetch(myRequest);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    let receiveTime = new Date();
                    let rtt = receiveTime.getTime() - sendTime.getTime();
                    console.log(`Round-trip time for request ${i + 1}: ${rtt} ms`);
                    totalRoundTripTime += rtt;
                } catch (error) {
                    reject(error);
                    return;
                }
            }
        };

        await pingLoop();

        averageRoundTripTime = totalRoundTripTime / 10;
        resolve(averageRoundTripTime);
    });
};
export let responseTime = function(url, induced_delay) {
    return new Promise(async (resolve, reject) => {
        let promises = [];

        for (let j = 0; j < 20; j++) {
            let text = "Hello";
            let delay = averageRoundTripTime * induced_delay;
            var sendTime = performance.now();
            const fetchPromise = fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(text),
            });

            let promise = (function(j) {  
                return new Promise((innerResolve, innerReject) => {
                    setTimeout(() => {
                        text = "Bye";     
                        fetchPromise
                            .then(response => {
                                var timeTaken = performance.now() - sendTime;
                                console.log(`Server responded in ${timeTaken} milliseconds for j ${j}`);
                                if (response.ok) {
                                    return response.json();
                                } else {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                            })
                            .then(responseData => {
                                if (responseData == text) {
                                    dataMatch++;
                                }
                                innerResolve();
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                innerResolve();
                            });
                    }, delay);
                });
            })(j);

            promises.push(promise);
        }

        await Promise.all(promises);
        resolve(dataMatch * 5);
    });
};



let serverURL = "http://localhost:2090/";
ping(serverURL)
    .then((averageRoundTripTime) => {
        console.log("Average Round-trip time:", averageRoundTripTime, "ms");
        return responseTime(serverURL, averageRoundTripTime * 0.8);
    })
    .then((dataMatch) => {
        console.log("Probability of data matching:" + dataMatch + "%");
    })
    .catch((error) => {
        console.error("Error:", error);
    }); 
