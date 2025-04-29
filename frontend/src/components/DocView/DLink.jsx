function DLink({ id }) {
    const linkMap = {
        "1-1-1": "https://docs.google.com/document/d/1X2AQWjb2NknODAyLLswdYfaJWipSsbBVmmu3VmNvOhg/",
        "1-1-2": "https://docs.google.com/presentation/d/1Oi-E7b3SzIUhrzlpsfD1I8I3tUNIMBHDC2c88QaE5P0/",
        "1-2-1": "https://docs.google.com/document/d/e/2PACX-1vQeIimE5OrrdPibAuFVjbs2sA5Qcp-bzfdefHOH4bAIx9si86aaBJ3HOd3Fm4OTG14ISCjs5N33j0XN/pub",
        "1-2-2": "https://docs.google.com/document/d/e/2PACX-1vQYBZ0oWxVmQomyDaH5uEMfVgyjVp735DR5oFSCkdC3_KxQqgeEUJ0QyJ1VlbNE6t4D3oqsrXMtK3aZ/pub",
        "1-2-3": "https://docs.google.com/document/d/e/2PACX-1vTcCx8Cli4o9jTtaWGf3IYaE_kS3Cry3gM5evu63OIpAUHjYTpYzagcaq5dfdlPOQ3W29ioq_hmY5Gl/pub",
        "1-2-4": "https://docs.google.com/presentation/d/e/2PACX-1vTm0U1sJZH0OTheMNDAn645bD_2qANA2ti9Hp6Fz5cH23OY3XF-VEUwK8-aHQfAkzOMDfz7o1HBGiFn",
        "1-2-5": "https://docs.google.com/document/d/e/2PACX-1vTbGLjqaxVgJHjf8XAMzGx2Z1v8AzbBE0zguOW-WkhmW2OqInVmJY_kqHjiUbFT0jTH8wKk-O73ktf6/pub",
        "1-3-1": "https://docs.google.com/presentation/d/e/2PACX-1vSlfvXuh9OnNgOHAZFfTekH5NYp9eKvTaWJWqQNmzE5Q-hJCSd-mMx55w4Ft-RhUCIh9s_tnrEFwbh0",
        "1-3-2": "https://docs.google.com/document/d/e/2PACX-1vT5hwF-rLCVF6fnKHV3kdjXxtksldxeBMLkQXs0F6jM7VothG6sO9lwy6h-fq3YhBZoPhOZjJJLQHij/pub",
        "1-4-1": "https://docs.google.com/presentation/d/e/2PACX-1vRLyoKopauzVA_6K1-WgXms-Gzu_oqiOMxH6-cz1t9gHU85hvS5lb9fIS9WmFba0DhVJOy_tEK4FmQ_",
        "1-4-2": "https://docs.google.com/document/d/e/2PACX-1vQjV_X3rUEodMKcQ1uVDAz26hO9RLaxOoTs4Ob9P9JE1SN66BuX1_xg53lpNe08vxSp54Z4HP0q2EwD/pub",
        "2-1-1": "https://docs.google.com/document/d/e/2PACX-1vRtC_59RrJpHiglbuV3Sqar_Z1AWGzeRCfmg22tipFQPpOeO77ZULzPoKYFA3HN-8EbMHY_U3ZPwpu2/pub",
        "2-1-2": "https://docs.google.com/presentation/d/e/2PACX-1vRB7y-wxrzfc_zhkoEFEl6bO7dcGxNlvw2u7W05ZUJ1yzj8heUnknXASLY0xMx-u9cZlWrX5aF7s-3S",
        "2-2-1": "https://docs.google.com/presentation/d/e/2PACX-1vQlAHbIBWOa_FCqSNd9ufRk_9L8AxAxD6MU8RC1z3-qmdlUmpq_V6SJH8N6GJUQKpoJL5Nj1O52Fuko",
        "2-2-2": "https://docs.google.com/document/d/e/2PACX-1vSc9g0pQjUNFrjPxb0OF7jE2q5JRXaVELbGIp8s0JgoCzp4ksZ-2NrDpOpYtAXQYl_1HShAF3YTIPTY/pub",
        "2-3-1": "https://docs.google.com/document/d/e/2PACX-1vTwOiURAGmQ4Az6s2MJ3kLqWkmmnG46CzQlL9GOhK7AYCSjGiypgx33qvgP_pWrHz8ZVjgL9eYugn7c/pub",
        "2-3-2": "https://docs.google.com/presentation/d/e/2PACX-1vS9qIprXR87s_bUJb3T0g_5j_lCrUCKv2YH0yNI61c0RZRUwJxw5Gwc9pLKf6g6RYBN0l9mfTahuA9P",
        "2-3-3": "https://docs.google.com/document/d/e/2PACX-1vRGBiUINIWkXsD0DbWbsSPi-2rpre-pI6YyrOlE3z7ySVEKji4LC2HF6w6XxF6JeuTPMRxm4Etl4PFU/pub",
        "2-4-1": "https://docs.google.com/document/d/e/2PACX-1vQAkYzfvEGrrEFui1Wm1EV4fD_Kx6aVOyAe6XlQz15Txm-XehROSIVaf5ilxQhNBZ5o_Av-mAz7Chms/pub",
        "2-4-2": "https://www.youtube.com/watch?v=gnpIhxtMmyQ",
        "2-4-3": "https://docs.google.com/presentation/d/e/2PACX-1vREp2y6B7Bs0XnHI4WMArhSxqrqwb1pTcRHLr28hGr-nf8-wvwoGZuUf3hcq2nFQ2c-qqbJ5zPL4Cyn/pub",
        "2-4-4": "https://docs.google.com/document/d/e/2PACX-1vRqK1Hin-4AbBgFnznlaocr-pJf69X2X3XV5NeW2MaAHJ8aEPS7oOBluWGtk4mtyY7Z-EKh3Rc1wKLe/pub"
    };
    const textMap = {
        "1-1-1": "Plan",
        "1-1-2": "Presentation",
        "1-2-1": "Requirements",
        "1-2-2": "Design",
        "1-2-3": "Test",
        "1-2-4": "Presentation",
        "1-2-5": "Progress Evaluation",
        "1-3-1": "Presentation",
        "1-3-2": "Progresss Evaluation",
        "1-4-1": "Presentation",
        "1-4-2": "Progress Evaluation",
        "2-1-1": "Plan",
        "2-1-2": "Presentation",
        "2-2-1": "Presentation",
        "2-2-2": "Progress Evalution",
        "2-3-1": "Poster",
        "2-3-2": "Presentation",
        "2-3-3": "Progress Evaluation",
        "2-4-1": "User Manual",
        "2-4-2": "Demo Video",
        "2-4-3": "Presentation",
        "2-4-4": "Progress Evaluation"
    };
    return (
        <a href={linkMap[id]} target="_blank">{textMap[id]}</a>
    )
}
export default DLink