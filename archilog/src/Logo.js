function printARCHILOG() {
    // 각 글자를 한 줄로 출력하기 위한 배열
    const lines = new Array(7).fill("");

    // A
    lines[0] += "      *       ";
    lines[1] += "     * *      ";
    lines[2] += "    *   *     ";
    lines[3] += "   *     *    ";
    lines[4] += "  * * * *     ";
    lines[5] += " *           * ";
    lines[6] += "*             *";

    // R
    lines[0] += "  * * * *     ";
    lines[1] += "  *      *    ";
    lines[2] += "  * * * *     ";
    lines[3] += "  *     *     ";
    lines[4] += "  *      *    ";
    lines[5] += "  *       *   ";
    lines[6] += "  *         * ";

    // C
    lines[0] += "   * * * *    ";
    lines[1] += " *             ";
    lines[2] += " *             ";
    lines[3] += " *             ";
    lines[4] += " *             ";
    lines[5] += " *             ";
    lines[6] += "   * * * *    ";

    // H
    lines[0] += " *           * ";
    lines[1] += " *           * ";
    lines[2] += " *           * ";
    lines[3] += " * * * * * * * ";
    lines[4] += " *           * ";
    lines[5] += " *           * ";
    lines[6] += " *           * ";

    // I
    lines[0] += "   * * * *    ";
    lines[1] += "      *       ";
    lines[2] += "      *       ";
    lines[3] += "      *       ";
    lines[4] += "      *       ";
    lines[5] += "   * * * *    ";

    // L
    lines[0] += " *             ";
    lines[1] += " *             ";
    lines[2] += " *             ";
    lines[3] += " *             ";
    lines[4] += " *             ";
    lines[5] += " *             ";
    lines[6] += "   * * * *    ";

    // O
    lines[0] += "   * * * *    ";
    lines[1] += " *           * ";
    lines[2] += " *           * ";
    lines[3] += " *           * ";
    lines[4] += " *           * ";
    lines[5] += " *           * ";
    lines[6] += "   * * * *    ";

    // G
    lines[0] += "   * * * *    ";
    lines[1] += " *             ";
    lines[2] += " *             ";
    lines[3] += " *      * * *  ";
    lines[4] += " *           * ";
    lines[5] += " *           * ";
    lines[6] += "   * * * *    ";

    // 최종 출력
    for (let i = 0; i < 7; i++) {
        console.log(lines[i]);
    }
}

printARCHILOG();
