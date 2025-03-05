document.addEventListener('DOMContentLoaded', () => {
    // 页面加载完成后的处理
    window.addEventListener('load', () => {
        const loaderWrapper = document.querySelector('.loader-wrapper');
        const pageContent = document.querySelector('.page-content');
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');

        // 模拟加载进度
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;

            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;

            if (progress === 100) {
                clearInterval(interval);
                // 等待进度条到达100%后再淡出
                setTimeout(() => {
                    loaderWrapper.classList.add('fade-out');
                    pageContent.classList.add('fade-in');

                    // 加载动画完全消失后再执行其他动画
                    setTimeout(() => {
                        // 导航栏动画
                        gsap.from('.navbar', {
                            y: -50,
                            opacity: 0,
                            duration: 1,
                            ease: 'power3.out'
                        });

                        // 内容区动画
                        gsap.from('.content-section', {
                            y: 50,
                            opacity: 0,
                            duration: 1,
                            delay: 0.3,
                            ease: 'power3.out'
                        });

                        // 表格行动画
                        gsap.from('.share-table tr', {
                            opacity: 0,
                            y: 20,
                            duration: 0.5,
                            stagger: 0.1,
                            delay: 0.8,
                            ease: 'power2.out'
                        });

                        // FAQ项目动画（仅在教程页面）
                        const faqItems = document.querySelectorAll('.faq-item');
                        if (faqItems.length > 0) {
                            gsap.from('.faq-item', {
                                opacity: 0,
                                y: 30,
                                duration: 0.5,
                                stagger: 0.1,
                                delay: 0.8,
                                ease: 'power2.out'
                            });
                        }
                    }, 500);
                }, 200);
            }
        }, 100);
    });

    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        if (currentScroll > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        }

        lastScroll = currentScroll;
    });

    // 链接悬停动画
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // 添加表格行悬停效果
    document.querySelectorAll('.share-table tr').forEach(row => {
        row.addEventListener('mouseenter', () => {
            gsap.to(row, {
                backgroundColor: 'var(--gray-100)',
                duration: 0.3
            });
        });

        row.addEventListener('mouseleave', () => {
            gsap.to(row, {
                backgroundColor: 'var(--white)',
                duration: 0.3
            });
        });
    });
}); 