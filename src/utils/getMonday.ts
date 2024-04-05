export function getMonday() {
    const today = new Date();

    // ✅ Get the first day of the current week (Sunday)
    return new Date(today.setDate(today.getDate() - today.getDay()));
}