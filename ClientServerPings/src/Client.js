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

        const averageRoundTripTime = totalRoundTripTime / 10;
        resolve(averageRoundTripTime);
    });
};

function responseTime(serverURL,averageRoundTripTime,delay) {
    return new Promise((resolve, reject) => {
        let text = "Hello";
        setTimeout(() => { text = "Bye"; }, delay*averageRoundTripTime);

        let myRequest = new Request(serverURL, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(text),
        });

        fetch(myRequest)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseText) => { 
                resolve(responseText == text); 
            })
            .catch((error) => {
                console.error('Error:', error);
                reject(error);
            });
        });
}
 
let serverURL = "http://localhost:2090/";   
ping(serverURL)
    .then((averageRoundTripTime) => {
        console.log("Average Round-trip time:", averageRoundTripTime, "ms");
        return responseTimeCall(serverURL, averageRoundTripTime,0.8);
    })
    .catch((error) => { 
        console.error("Error:", error);
    }); 

export async function responseTimeCall(serverURL,averageRoundTripTime,delay) {
        var dataMatch = 0;
        for (let i = 0; i < 20; i++) {  
            try {
                const isMatch = await responseTime(serverURL,averageRoundTripTime,delay);
                if (isMatch)
                dataMatch++;  
            } catch (error) {
                console.error('Failed request:', error);
            }
        }
        console.log("Probability of data matching:" + dataMatch*5 + "%");
        return dataMatch*5;
    }

