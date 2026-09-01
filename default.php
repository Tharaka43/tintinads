<?php // Keep file as PHP ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tin Tin Ads | Coming Soon</title>

<style>
    :root {
        --blue: #1E48FF;
        --pink: #FF4F9A;
        --white: #ffffff;
        --gray: #9e9e9e;
        --dark: #0b0e13;
    }

    body {
        margin: 0;
        background: var(--dark);
        font-family: "Poppins", Arial, sans-serif;
        color: var(--white);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        padding: 20px;
    }

    .wrapper {
        animation: fadeIn 1.5s ease-out;
        max-width: 480px;
        width: 100%;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Title */
    h1 {
        font-size: 42px;
        margin-bottom: 5px;
        background: linear-gradient(90deg, var(--blue), var(--pink));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
    }

    /* Sub text */
    .subtitle {
        color: var(--gray);
        font-size: 18px;
        margin-bottom: 30px;
    }

    /* Countdown */
    #countdown {
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 40px;
    }

    #countdown div {
        background: rgba(255, 255, 255, 0.08);
        padding: 12px 16px;
        border-radius: 12px;
        width: 70px;
    }

    #countdown span {
        font-size: 28px;
        font-weight: bold;
        color: var(--pink);
    }

    #countdown small {
        font-size: 12px;
        color: var(--gray);
    }

    /* Fire */
    .fire {
        position: relative;
        margin: 0 auto;
        width: 80px;
        height: 120px;
    }

    .flame {
        position: absolute;
        bottom: 0;
        width: 26px;
        height: 45px;
        background: radial-gradient(circle, #ffe600, #ff4f00);
        border-radius: 50%;
        animation: flame 1.2s infinite ease-in-out alternate;
        opacity: 0.9;
        filter: blur(1px);
    }

    .flame:nth-child(1) { left: 5px; animation-delay: 0s; }
    .flame:nth-child(2) { left: 25px; animation-delay: 0.2s; }
    .flame:nth-child(3) { left: 45px; animation-delay: 0.4s; }
    .flame:nth-child(4) { left: 65px; animation-delay: 0.6s; }

    @keyframes flame {
        0% { transform: translateY(0) scale(1); opacity: 0.9; }
        100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
    }

    /* Mobile Responsive */
    @media (max-width: 420px) {
        h1 { font-size: 32px; }
        .subtitle { font-size: 16px; }
        #countdown div { width: 60px; padding: 10px; }
        #countdown span { font-size: 22px; }
    }
</style>
</head>

<body>

<div class="wrapper">

    <h1>Tin Tin Ads</h1>
    <p class="subtitle">We are building something amazing for you…</p>

    <div id="countdown">
        <div><span id="days"></span><br><small>Days</small></div>
        <div><span id="hours"></span><br><small>Hours</small></div>
        <div><span id="minutes"></span><br><small>Minutes</small></div>
        <div><span id="seconds"></span><br><small>Sec</small></div>
    </div>

    <div class="fire">
        <div class="flame"></div>
        <div class="flame"></div>
        <div class="flame"></div>
        <div class="flame"></div>
    </div>
</div>

<script>
const launchDate = new Date("2025-12-06 14:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = launchDate - now;

    if (diff <= 0) {
        document.querySelector(".subtitle").innerHTML = "We Are Live!";
        document.getElementById("countdown").style.display = "none";
        return;
    }

    document.getElementById("days").innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById("hours").innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("minutes").innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById("seconds").innerText = Math.floor((diff % (1000 * 60)) / 1000);
}

setInterval(updateCountdown, 1000);
</script>

</body>
</html>
