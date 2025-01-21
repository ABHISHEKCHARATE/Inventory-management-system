import React from 'react';

const DownloadInventoryData = () => {
    const downloadReport = async () => {
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://127.0.0.1:8000/inventory-report/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'inventory_report.csv';
                link.click();
            } else {
                console.error('Failed to download report');
            }
        } catch (error) {
            console.error('Error downloading the report:', error);
        }
    };

    return (
        <div>
            <ul>
                <li>
                    <a href="#" onClick={downloadReport}>Download Data</a>
                </li>
            </ul>
        </div>
    );
};

export default DownloadInventoryData;
