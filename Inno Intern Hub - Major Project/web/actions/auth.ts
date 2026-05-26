"use server";

import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    // TODO: Validate and Check DB
    console.log("Login Attempt:", email);

    // Mock login success
    // Redirect based on simulated role? For now, go to dashboard
    redirect("/dashboard");
}

export async function register(formData: FormData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role");

    // TODO: Create User in DB
    console.log("Register Attempt:", { name, email, role });

    // Redirect to role specific dashboard
    if (role === "student") redirect("/dashboard/student");
    if (role === "innovator") redirect("/dashboard/innovator");
    if (role === "investor") redirect("/dashboard/investor");

    redirect("/dashboard");
}
