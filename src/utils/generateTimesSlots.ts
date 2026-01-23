export function generateSlots(
    start: string,
    end: string,
    block: number
): string[] {
    const slots: string[] = []

    let [h, m] = start.split(':').map(Number)

    const [endH, endM] = end.split(':').map(Number)

    while (h < endH || (h === endH && m < endM)) {
        slots.push(
            `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        )

        m += block
        if (m >= 60) {
            h++
            m = 0
        }
    }

    return slots
}
