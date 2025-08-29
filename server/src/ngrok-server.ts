import ngrok from 'ngrok';

(async function () {
  try {
    const url = await ngrok.connect({
      addr: 4000, // your backend port
      authtoken: '31x1lOPW32cR1arsjtEItFvLB1R_35cqVBuNQY68hjWutzX61', // optional
    });
    console.log('Ngrok URL:', url);

    // Keep the process alive
    process.stdin.resume();
  } catch (err) {
    console.error('Failed to start ngrok:', err);
    process.exit(1);
  }
})();
