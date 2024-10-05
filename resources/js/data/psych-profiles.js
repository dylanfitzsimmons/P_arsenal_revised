let psychProfiles = [
    {
        label: 'Standard',
        percent_label: '-',
        percent: 0,
    },

    {
        label: 'Veteran',
        percent: 0.3,
    },
    {
        label: 'Elite',
        percent: 0.5,
    },
    {
        label: 'Command',
        percent: 1,
    },
    {
        label: 'Fanatic',
        percent: -0.1,
    },
    {
        label: 'Hive',
        percent: -0.1,
    },
    {
        label: 'Mercenary',
        percent: -0.15,
    },
    {
        label: 'Robot',
        percent: 0.4,
    },
];

psychProfiles.forEach(item => {
    let percent_label = item.percent_label;
    let percent       = item.percent;
    let label         = item.label;

    if (!item.percent_label) {
        let label = '';

        if (percent > 0) {
            label += '+';
        }
        label += percent * 100;
        label += '%';

        item.percent_label = label;
    }
});

export default psychProfiles;
