import styles from "./DocView.module.css"
import DLink from "./DLink"
function DocView() {
    return (
        <div className={styles.docContainer}>
            <div className={styles.horizontalContainer}>
                <div>
                    <h2>Team Members</h2>
                    <table className={styles.infoTable}>
                        <tbody>
                            <tr>
                                <th>Daniel Couturier</th>
                                <td>dcouturier2022@my.fit.edu</td>
                            </tr>
                            <tr>
                                <th>Evan Thompson</th>
                                <td>thompsone2021@my.fit.edu</td>
                            </tr>
                            <tr>
                                <th>Artur Quarra</th>
                                <td>aquarra2020@my.fit.edu</td>

                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h2>Project Advisor: </h2>
                    <p><strong>Khaled Slhoub </strong> slhoub@fit.edu </p>
                </div>
            </div>



            <h2>First Semester</h2>
            <table className={styles.infoTable}>
                <tbody>
                    <tr>
                        <th>Plan (Sep 4)</th>
                        <td><DLink id="1-1-1" /></td>
                        <td><DLink id="1-1-2" /></td>
                    </tr>
                    <tr>
                        <th>Milestone 1 (Sep 30)</th>
                        <td><DLink id="1-2-1" /></td>
                        <td><DLink id="1-2-2" /></td>
                        <td><DLink id="1-2-3" /></td>
                        <td><DLink id="1-2-4" /></td>
                        <td><DLink id="1-2-5" /></td>
                    </tr>
                    <tr>
                        <th>Milestone 2 (Oct 28)</th>
                        <td><DLink id="1-3-1" /></td>
                        <td><DLink id="1-3-2" /></td>
                    </tr>
                    <tr>
                        <th>Milestone 3 (Nov 25)</th>
                        <td><DLink id="1-4-1" /></td>
                        <td><DLink id="1-4-2" /></td>
                    </tr>
                </tbody>
            </table>
            <h2>Second Semester</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Plan (Jan 27)</th>
                        <td><DLink id="2-1-1" /></td>
                        <td><DLink id="2-1-2" /></td>
                    </tr>
                    <tr>
                        <th>Milestone 4 (Feb 24)</th>
                        <td><DLink id="2-2-1" /></td>
                        <td><DLink id="2-2-2" /></td>
                    </tr>
                    <tr>
                        <th>Milestone 5 (Mar 26)</th>
                        <td><DLink id="2-3-1" /></td>
                        <td><DLink id="2-3-2" /></td>
                        <td><DLink id="2-3-3" /></td>
                    </tr>
                    <tr>
                        <th>Milestone 6 (Apr 21)</th>
                        <td><DLink id="2-4-1" /></td>
                        <td><DLink id="2-4-2" /></td>
                        <td><DLink id="2-4-3" /></td>
                        <td><DLink id="2-4-4" /></td>
                    </tr>
                    <tr>
                        <th>Apr 25 (Fri)</th>
                        <td>Student Design Showcase</td>
                    </tr>
                </tbody>
            </table>
        </div>

    )
}
export default DocView