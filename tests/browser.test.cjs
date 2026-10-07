const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch(process.env.BROWSER_EXE?{executablePath:process.env.BROWSER_EXE,headless:true}:{channel:'msedge',headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
 const click=a=>page.locator(`[data-action="${a}"]`).click();
 const add=id=>page.locator(`.product[data-id="${id}"]`).click();
 const value=()=>page.locator('[data-testid="total"]').textContent();
 assert.equal(await page.locator('.product').count(),6);assert.equal(await page.locator('[data-action="review"]').isDisabled(),true);
 await add('coffee');await add('coffee');await add('sandwich');await add('soda');assert.equal(await value(),'₱175.00');
 await page.locator('.qty [data-action="add"][data-id="coffee"]').click();assert.equal(await value(),'₱220.00');
 await page.locator('[data-action="minus"][data-id="coffee"]').click();assert.equal(await value(),'₱175.00');
 await page.locator('[data-action="remove"][data-id="soda"]').click();assert.equal(await value(),'₱140.00');
 await click('review');assert.ok((await page.locator('table').textContent()).includes('₱90.00'));await click('order');assert.equal(await value(),'₱140.00');await add('soda');
 await click('review');await click('methods');await click('cash');
 for(const bad of ['', '-10','abc','175.001','100']){await page.locator('#cash').fill(bad);await click('pay');assert.equal(await page.locator('#cash-error').isVisible(),true);assert.equal(await page.locator('h1').textContent(),'Cash Payment');}
 await page.locator('#cash').fill('200');assert.equal(await page.locator('#change').textContent(),'₱25.00');await click('pay');assert.equal(await page.locator('h1').textContent(),'Payment Successful');
 const refs=[await page.locator('.reference').textContent()];await click('receipt');assert.ok((await page.locator('.receipt').textContent()).includes('₱25.00'));assert.ok((await page.locator('.receipt').textContent()).includes('2 × ₱45.00'));
 if(process.env.QA_DIR)await page.screenshot({path:path.join(process.env.QA_DIR,'receipt.png'),fullPage:true});
 await click('reset');assert.equal(await value(),'₱0.00');assert.equal(await page.locator('.cart-item').count(),0);assert.equal(await page.locator('.reference').count(),0);
 for(const method of ['cash','qr','card']){await add('coffee');await click('review');await click('methods');await click(method);if(method==='cash'){assert.equal(await page.locator('#cash').inputValue(),'');await page.locator('[data-action="quick"]').first().click();await click('pay');}else if(method==='qr')await click('confirm');else{await click('process');assert.equal(await page.locator('[data-action="methods"]').isDisabled(),true);await page.waitForSelector('[data-action="receipt"]');}refs.push(await page.locator('.reference').textContent());await click('receipt');const txt=await page.locator('.receipt').textContent();assert.ok(txt.includes(method==='cash'?'Cash':method==='qr'?'QR Payment':'Credit / Debit Card'));assert.ok(txt.includes('₱0.00'));await click('reset');}
 assert.equal(new Set(refs).size,4);
 for(const width of [1440,768,390]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);if(process.env.QA_DIR)await page.screenshot({path:path.join(process.env.QA_DIR,`order-${width}.png`),fullPage:true});}
 assert.deepEqual(errors,[]);console.log('PASS: cart, review/back, invalid/insufficient/exact/excess cash, QR, card lock, receipts, unique references, reset, 3 responsive widths, no JS errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
