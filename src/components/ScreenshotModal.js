import React, { useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const ScreenshotModal = ({ screenshotBase64 }) => {
    const [open, setOpen] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${screenshotBase64}`;
        link.download = 'screenshot.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <img
                src={`data:image/png;base64,${screenshotBase64}`}
                alt="Failure screenshot"
                style={{ maxWidth: 300, marginTop: 8, border: '1px solid #ccc', cursor: 'pointer' }}
                onClick={() => setOpen(true)}
            />
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1300,
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            bgcolor: '#fff',
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                        }}
                    >
                        {/* Download Button */}
                        <IconButton
                            onClick={handleDownload}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 56,
                                color: '#fff',
                                background: '#1976d2',
                                borderRadius: '50%',
                                width: 40,
                                height: 40,
                                '&:hover': { background: '#115293' },
                                zIndex: 1400,
                            }}
                            size="large"
                            aria-label="download"
                        >
                            <DownloadIcon style={{ fontSize: 24 }} />
                        </IconButton>
                        {/* Close Button */}
                        <IconButton
                            onClick={() => setOpen(false)}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: '#fff',
                                background: '#d32f2f',
                                borderRadius: '50%',
                                width: 40,
                                height: 40,
                                '&:hover': { background: '#b71c1c' },
                                zIndex: 1400,
                            }}
                            size="large"
                            aria-label="close"
                        >
                            <span style={{ fontSize: 28, fontWeight: 'bold', lineHeight: 1 }}>×</span>
                        </IconButton>
                        <img
                            src={`data:image/png;base64,${screenshotBase64}`}
                            alt="Failure screenshot"
                            style={{ maxWidth: '80vw', maxHeight: '80vh', boxShadow: '0 0 24px #0002' }}
                        />
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ScreenshotModal;