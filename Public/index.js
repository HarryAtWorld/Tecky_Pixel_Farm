// window.onload = async () => {
//     await getUserInfo();
//     initLoginForm();
// }

async function getUserInfo() {
    const resp = await fetch("/users/info");
    if (resp.status === 200) {
        const result = await resp.json();
        user = result.user;
        console.log(user);
    }
}

function initLoginForm() {
    document.querySelector("#login").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value;
        const password = form.password.value;
        const resp = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        const result = await resp.json();
        if (!result.success) {
        } else {
            window.location.href = "/admin.html";
        }
    });
}
